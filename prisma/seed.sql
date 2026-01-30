INSERT INTO "User" ("id", "email", "subdomain", "name", "updatedAt", "createdAt") 
VALUES ('user-admin-01', 'admin@beatfarda.com', 'beatfarda', 'Beatfarda', 1706299200000, 1706299200000)
ON CONFLICT("email") DO NOTHING;
