// transform.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// İstemciye döneceğimiz standart yanıtın TypeScript tipi
export interface StandardResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    timestamp: string;
    data: T;
}

@Injectable()
export class ResponseFormatInterceptor<T>
    implements NestInterceptor<T, StandardResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<StandardResponse<T>> {
        // HTTP Response ve Request nesnelerine erişim
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse();
        const request = httpContext.getRequest();

        // next.handle() -> Controller metodunu çalıştırır ve dönen veriyi RxJS Observable olarak yakalar
        return next.handle().pipe(
            map((data) => {
                // Controller'dan özel bir mesaj fırlatılmadıysa varsayılan mesaj tanımı
                const message = data?.message || 'İşlem başarıyla gerçekleştirildi.';

                // Eğer controller nesne içinde { message, data } şeklinde döndüyse data alanını ayıkla
                const cleanData = data && data.message && data.data !== undefined ? data.data : data;

                return {
                    success: true,
                    statusCode: response.statusCode,
                    message: message,
                    timestamp: new Date().toISOString(),
                    path: request.url,
                    data: cleanData,
                };
            }),
        );
    }
}