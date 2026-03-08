import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017', {
      dbName: 'produktkonfigurator',
    }),
    ProductModule,
  ],
})
export class AppModule {}
