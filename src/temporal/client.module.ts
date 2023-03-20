import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Connection } from '@temporalio/client';
import { TemporalModule } from 'nestjs-temporal';

@Module({
  imports: [
    TemporalModule.registerClientAsync({
      imports: [ConfigModule],
      inject: [],
      useFactory: async () => {
        const connection = await Connection.connect({
          address: '127.0.0.1:7233',
        });

        return {
          connection,
        };
      },
    }),
  ],
})
export class ClientModule {}
