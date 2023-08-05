variable "compute_name" {
  type        = string
  default     = "tm-compute"
  description = "name for the compute node"
}

variable "public_key_path" {
  type        = string
  description = "path to public key"
  sensitive   = true
}

variable "private_key_path" {
  type        = string
  description = "path to private key"
  sensitive   = true
}