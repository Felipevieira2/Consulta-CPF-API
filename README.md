<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[WebReinvent](https://webreinvent.com/)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Jump24](https://jump24.co.uk)**
- **[Redberry](https://redberry.international/laravel/)**
- **[Active Logic](https://activelogic.com)**
- **[byte5](https://byte5.de)**
- **[OP.GG](https://op.gg)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

# Projeto Docker com Apache e MySQL

Este projeto configura um ambiente Docker com Apache e MySQL para desenvolvimento.

## Estrutura do Projeto

- `docker-compose.yml`: Configuração do Docker Compose.
- `Dockerfile`: Configuração do servidor web.
- `apache-config.conf`: Configuração do Apache.
- `www/`: Pasta para seus arquivos PHP.

## Como Executar o Dockerfile

Para executar o ambiente Docker que criamos, você precisa seguir alguns passos simples:

### Passo a Passo para Executar

1. **Crie uma pasta para o projeto**:
   ```bash
   mkdir meu-projeto-docker
   cd meu-projeto-docker
   ```

2. **Crie todos os arquivos necessários**:
   - Salve o `docker-compose.yml` que forneci anteriormente
   - Salve o `Dockerfile` 
   - Crie o arquivo `apache-config.conf`
   - Crie uma pasta `www` e dentro dela o arquivo `index.php`

3. **Execute o docker-compose**:
   ```bash
   docker-compose up -d
   ```

O comando `docker-compose up -d` faz todo o trabalho:
- Ele lê o arquivo `docker-compose.yml`
- Constrói a imagem definida no `Dockerfile`
- Inicia os containers em modo detached (em segundo plano)

### Verificando se está funcionando

Para verificar se os containers estão rodando:
```bash
docker-compose ps
```

Para ver os logs:
```bash
docker-compose logs
```

### Acessando a aplicação

Depois que os containers estiverem rodando, você pode acessar:
- Seu site: http://localhost
- O MySQL: localhost:3306 (usando um cliente MySQL)

### Comandos úteis

- **Parar os containers**:
  ```bash
  docker-compose down
  ```

- **Reconstruir após alterações no Dockerfile**:
  ```bash
  docker-compose up -d --build
  ```

- **Entrar no container web**:
  ```bash
  docker-compose exec webserver bash
  ```

- **Entrar no container MySQL**:
  ```bash
  docker-compose exec db mysql -u app_user -p
  ```

### Observações importantes

1. Você não precisa executar o `Dockerfile` diretamente - o `docker-compose` faz isso por você
2. Qualquer alteração nos arquivos da pasta `www` será refletida imediatamente, pois essa pasta está mapeada como volume
3. Se você alterar o `Dockerfile`, precisará reconstruir a imagem com `docker-compose up -d --build`

## Contribuições

Sinta-se à vontade para contribuir com melhorias ou correções!