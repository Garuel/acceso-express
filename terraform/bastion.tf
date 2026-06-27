resource "aws_instance" "bastion" {
  ami           = "ami-0440d3b780d96b29d"
  instance_type = "t3.micro"
  subnet_id     = aws_subnet.public_subnet_1a.id
  key_name      = "seb-bastion" 

  vpc_security_group_ids = [aws_security_group.bastion_sg.id]

  tags = { Name = "bastion-host" }
}

