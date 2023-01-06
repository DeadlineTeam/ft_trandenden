import { ArgumentsHost, HttpException,Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';


@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
	catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost)
	{
		const constraint = exception.meta?.target?.[0];
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		switch (exception.code)
		{
			case 'P2002':
			{
				const status = HttpStatus.CONFLICT;
				response.status(status).json({
				statusCode: status,
				message: constraint + " already used",
				});
				break;
			}
			default:
				super.catch(exception, host);
			break;
		}
	}
}