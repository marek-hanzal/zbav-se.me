variable "secrets" {
  description = "Application values decrypted from infra/<workspace>.enc.json by argc. Infrastructure values are generated separately."
  type        = map(string)
  sensitive   = true

  validation {
    condition     = alltrue([for value in values(var.secrets) : value != ""]) && lookup(var.secrets, "SERVER_BETTER_AUTH_SECRET", "") != ""
    error_message = "Fill the application secrets before planning. Values cannot be empty; SERVER_BETTER_AUTH_SECRET is required."
  }
}
