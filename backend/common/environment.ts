export const environment = {
    server: { port: process.env.SERV_PORT || 3000 },
    db: { url: process.env.DB_URL || 'mongodb://localhost/restaurant-api' }
}