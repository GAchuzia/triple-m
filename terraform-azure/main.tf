# find public ip via $terraform state show azurerm_linux_virtual_machine.tm_vm

# We strongly recommend using the required_providers block to set the
# Azure Provider source and version being used
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=3.0.0"
    }
  }
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
  features {
  }
}

# Create a resource group
resource "azurerm_resource_group" "tm_resources" {
  name     = "triplem_resources"
  location = "East Us"
  tags = {
    environment = "dev"
  }
}

# Create virtual network
resource "azurerm_virtual_network" "tm_virtualnet" {
  name                = "triplem_network"
  resource_group_name = azurerm_resource_group.tm_resources.name
  location            = azurerm_resource_group.tm_resources.location
  address_space       = ["10.123.0.0/16"]

  tags = {
    environment = "dev"
  }
}

# Create Subnet
resource "azurerm_subnet" "tm_subnet" {
  name                 = "tm_subnet"
  resource_group_name  = azurerm_resource_group.tm_resources.name
  virtual_network_name = azurerm_virtual_network.tm_virtualnet.name
  address_prefixes     = ["10.123.1.0/24"]
}

# Create security group
resource "azurerm_network_security_group" "tm_security_group" {
  name                = "tm_security_group"
  location            = azurerm_resource_group.tm_resources.location
  resource_group_name = azurerm_resource_group.tm_resources.name

  tags = {
    environment = "dev"
  }
}

# Security group rules
resource "azurerm_network_security_rule" "tm_dev_rule" {
  name                        = "tm_dev_rule"
  priority                    = 100
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "*"
  source_port_range           = "*"
  destination_port_range      = "*"
  source_address_prefix       = "*" #<-- add my ip
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.tm_resources.name
  network_security_group_name = azurerm_network_security_group.tm_security_group.name
}

resource "azurerm_subnet_network_security_group_association" "tm_security_group_association" {
  subnet_id                 = azurerm_subnet.tm_subnet.id
  network_security_group_id = azurerm_network_security_group.tm_security_group.id
}

resource "azurerm_public_ip" "tm_ip" {
  name                    = "tm_ip"
  location                = azurerm_resource_group.tm_resources.location
  resource_group_name     = azurerm_resource_group.tm_resources.name
  allocation_method       = "Static"
  idle_timeout_in_minutes = 30

  tags = {
    environment = "dev"
  }
}

resource "azurerm_network_interface" "tm_net_interface" {
  name                = "tm_net_interface"
  location            = azurerm_resource_group.tm_resources.location
  resource_group_name = azurerm_resource_group.tm_resources.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.tm_subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.tm_ip.id
  }

  tags = {
    environment = "dev"
  }
}

# RSA key of size 4096 bits
resource "tls_private_key" "key_generation" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Save key locally
resource "local_file" "tm_key" {
  filename = "${var.compute_name}_key.pem"
  content  = tls_private_key.key_generation.private_key_pem
}

# # template provision file
# data "template_file" "provision_file" {
#   template = file("provision.tpl")
#   vars     = {}
# }

resource "null_resource" "test" {
  provisioner "local-exec" {
    command = "echo ${data.azurerm_public_ip.data_public_ip.ip_address}"
  }
}

# Create VM
resource "azurerm_linux_virtual_machine" "tm_vm" {
  name                  = var.compute_name
  resource_group_name   = azurerm_resource_group.tm_resources.name
  location              = azurerm_resource_group.tm_resources.location
  size                  = "Standard_F2"
  admin_username        = "linuxuser"
  network_interface_ids = [azurerm_network_interface.tm_net_interface.id]

  # Run Node Provision Script
   custom_data = filebase64("provision.sh")

  admin_ssh_key {
    username   = "linuxuser"
    public_key = tls_private_key.key_generation.public_key_openssh
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "16.04-LTS"
    version   = "latest"
  }

  # provisioner "remote-exec" {
  #   inline = ["${data.template_file.provision_file.rendered}"]

  #   connection {
  #     host        = data.azurerm_public_ip.data_public_ip.ip_address
  #     type        = "ssh"
  #     user        = "linxuser"
  #     private_key = tls_private_key.key_generation.private_key_pem
  #     timeout     = "5m"
  #   }
  # }

  depends_on = [
    azurerm_network_interface.tm_net_interface,
  ]
}

data "azurerm_public_ip" "data_public_ip" {
  name                = azurerm_public_ip.tm_ip.name
  resource_group_name = azurerm_public_ip.tm_ip.resource_group_name
}

output "print_public_ip" {
  value = data.azurerm_public_ip.data_public_ip.ip_address
}

# Run provision
# resource "null_resource" "provision" {
#   depends_on = [azurerm_linux_virtual_machine.tm_vm, data.azurerm_public_ip.data_public_ip, null_resource.test]

#   provisioner "remote-exec" {
#     inline = ["${data.template_file.provision_file.rendered}"]
#   }

#   connection {
#     host        = "${data.azurerm_public_ip.data_public_ip.ip_address}"
#     type        = "ssh"
#     user        = "linxuser"
#     private_key = file("C:/Users/wongm/Documents/GitHub/triple-m/terraform-azure/key") #tls_private_key.key_generation.private_key_pem
#     timeout "5m"
#   }
# }