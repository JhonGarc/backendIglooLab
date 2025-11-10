import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { CreateProductDto } from "./dto/create-product.dto";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

async create(createProductDto: CreateProductDto) {
  try {
    const newProduct = await this.prisma.product.create({
      data: createProductDto,
    });

    return newProduct;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          throw new ConflictException("Ya existe un producto con ese nombre.");
        case "P1001":
          throw new InternalServerErrorException("No se pudo conectar a la base de datos.");
        default:
          console.error("Error Prisma:", error);
          throw new InternalServerErrorException("Error en la base de datos al crear el producto.");
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException("Los datos enviados no son válidos.");
    }

    console.error("Error desconocido al crear el producto:", error);
    throw new InternalServerErrorException("Error inesperado al crear el producto.");
  }
}

  async findAll() {
    try {
      return await this.prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
        },
      });
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      throw new InternalServerErrorException("No se pudieron obtener los productos.");
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.product.delete({
        where: { id },
      });

      return { message: `Producto con id ${id} eliminado correctamente.` };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundException(`No se encontró el producto con id ${id}`);
        } else if (error.code === "P2003") {
          throw new ConflictException("No se puede eliminar el producto porque tiene dependencias activas.");
        }
      }

      console.error("Error al eliminar el producto:", error);
      throw new InternalServerErrorException("Error inesperado al eliminar el producto.");
    }
  }
}
