resource "aws_vpc" "main_project_seb" {
  cidr_block           = "10.0.0.0/16"  
  enable_dns_hostnames = true
  tags                 = { Name = "seb-vpc" }
}

resource "aws_internet_gateway" "gw_seb" {
  vpc_id = aws_vpc.main_project_seb.id
  tags   = { Name = "seb-igw" }
}

resource "aws_subnet" "public_subnet_1a" {
  vpc_id                  = aws_vpc.main_project_seb.id
  cidr_block              = "10.0.10.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true 
  tags                    = { Name = "seb-public-subnet-1a" }
}

resource "aws_subnet" "private_subnet_1a" {
  vpc_id            = aws_vpc.main_project_seb.id
  cidr_block        = "10.0.20.0/24"
  availability_zone = "us-east-1a"
  tags              = { Name = "seb-private-subnet-1a" }
}

resource "aws_subnet" "private_subnet_1b" {
  vpc_id            = aws_vpc.main_project_seb.id
  cidr_block        = "10.0.21.0/24"
  availability_zone = "us-east-1b" 
  tags              = { Name = "seb-private-subnet-1b" }
}

resource "aws_route_table" "public_rt_seb" {
  vpc_id = aws_vpc.main_project_seb.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw_seb.id
  }

  tags = { Name = "seb-public-rt" }
}

resource "aws_route_table_association" "public_1a_assoc" {
  subnet_id      = aws_subnet.public_subnet_1a.id
  route_table_id = aws_route_table.public_rt_seb.id
}