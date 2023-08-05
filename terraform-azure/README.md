# Azure-Terraform Solution

An infrastructure in code solution to provision an instance of Triple-M on Azure Web Services.

# Settup & Running

Make sure to have Hashi-Corps Terraform and Azure-CLI Installed

https://developer.hashicorp.com/terraform/downloads?product_intent=terraform
https://learn.microsoft.com/en-us/cli/azure/install-azure-cli

Now, make sure to import terraform's libraries:

```bash
terraform init
```

Next, we need to generate a private/public key pair to ssh into our instance

```bash
ssh-keygen -q -t rsa -N '' -f <path here>
```

Go to terraform.tfvars file and make sure to set your VM's name:

```bash
compute_name = "<insert name here>"
public_key_path = "<insert public key path here>"
private_key_path = "<insert private key path here>"
```

## Deploy and Destroy

```bash
terraform apply -auto-approve
```

```bash
terraform destroy -auto-approve
```

# Expected Results

Running the provision should result in the deployment of a virtual machine along with it's accompanying support infrastructure (subnet, subinterfaces, security groups, etc) on the Azure Cloud. A shell script is run at the end and should output something similar as the code segment below:

```bash
<output sample goes here>
```
