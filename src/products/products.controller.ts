import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { SupabaseAuthGuard } from "src/auth/guards/supabase.auth.guard";

@ApiTags("products") // Agrupa las rutas en Swagger
@UseGuards(SupabaseAuthGuard)
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Crear un nuevo producto" })
  @ApiResponse({ status: 201, description: "Producto creado exitosamente." })
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: "Producto creado exitosamente",
      data: product,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Obtener todos los productos" })
  @ApiResponse({ status: 200, description: "Lista de productos." })
  async findAll() {
    const products = await this.productsService.findAll();
    return {
      statusCode: HttpStatus.OK,
      total: products.length,
      data: products,
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Eliminar un producto por ID" })
  @ApiResponse({
    status: 200,
    description: "Producto eliminado correctamente.",
  })
  @ApiResponse({ status: 400, description: "ID inválido." })
  @ApiResponse({ status: 404, description: "Producto no encontrado." })
  async remove(@Param("id", ParseIntPipe) id: number) {
    const result = await this.productsService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }
}
