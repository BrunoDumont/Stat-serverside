const prod = process.env.NODE_ENV === 'production'
let config
if(prod){
  config = {
    production: false,
    host: 'http://localhost:8000',
    secret: 'secretKey',
    database: {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'statqa',
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/src/database/migrations/*.js'],
      cli: {
        migrationsDir: 'src/database/migrations',
      },
      synchronize: true,
    }
  }
}else{
  config = {
    production: false,
    host: 'http://localhost:8000',
    secret: 'secretKey',
    database: {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'statqa',
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/src/database/migrations/*.js'],
      cli: {
        migrationsDir: 'src/database/migrations',
      },
      synchronize: true,
    }
  }
}
export default config
