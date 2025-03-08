resource "docker_network" "pdf_unlocker_network" {
  name = "pdf-unlocker-network"
}

resource "docker_image" "pdf-unlocker-backend" {
  name = "gangadharrr/pdf-unlocker-backend:latest"
}
// This is the same as doing:
// docker run -p 8200:8200 --name "terraform-basics-vault" hashicorp/vault:1.12.6
resource "docker_container" "pdf-unlocker-backend" {
  name  = "terraform-basics-pdf-unlocker-backend"
  image = docker_image.pdf-unlocker-backend.image_id

  ports {
    internal = 8000
    external = 8000
  }

  networks_advanced {
    name = docker_network.pdf_unlocker_network.name
    aliases = ["backend"]  # This makes the container accessible as "backend" in the network
  }
}
resource "docker_image" "pdf-unlocker-frontend" {
  name = "gangadharrr/pdf-unlocker-frontend:latest"
}

resource "docker_container" "pdf-unlocker-frontend" {
  name  = "terraform-basics-pdf-unlocker-frontend"
  image = docker_image.pdf-unlocker-frontend.image_id

  ports {
    internal = 80
    external = 80
  }

  networks_advanced {
    name = docker_network.pdf_unlocker_network.name
  }
}
