import { Module } from "@nestjs/common";
import { MailController } from "./mail.controller";
import { MailService } from "./mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { join } from "path";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { BullModule } from "@nestjs/bullmq";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "smtp.gmail.com",
        secure: true,
        port: 465,
        auth: {
          user: "baphuc3112@gmail.com",
          pass: "mpsf kley dhwt ckgs",
        },
      },
      defaults: {
        from: '"Pegasux" <noreply@example.com>',
      },
      template: {
        dir: join(__dirname, "template"),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
    BullModule.registerQueue({
      name: "emailQueue",
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService, BullModule],
})
export class MailModule {}
