output "instance_public_ip" {
  description = "Public IP of the SchemaInsight server"
  value       = aws_instance.schemainsight.public_ip
}

output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.schemainsight.id
}