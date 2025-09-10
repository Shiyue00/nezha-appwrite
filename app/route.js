// Этот файл обрабатывает GET-запросы к корневому URL-адресу ("/") вашего сайта.
export async function GET(request) {
  // Возвращает ответ "Hello World!" с кодом состояния 200 (OK).
  return new Response('Hello World!', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
