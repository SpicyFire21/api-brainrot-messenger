CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users
(
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pseudo      VARCHAR(50)  NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    public_key  TEXT,
    private_key TEXT,
    rsa_modulo TEXT
);

CREATE TABLE IF NOT EXISTS messages
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content    TEXT,
    createdAt  TIMESTAMPTZ      DEFAULT CURRENT_TIMESTAMP,
    senderId   UUID NOT NULL,
    receiverId UUID NOT NULL,
    FOREIGN KEY (senderId) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (receiverId) REFERENCES users (id) ON DELETE CASCADE
);


-- -- Insert users
-- INSERT INTO users (id, pseudo, password)
-- VALUES ('1f8d37d2-0f29-4fbd-8db4-8d5c9871aee0', 'Larry_Le_Malicieux', '1234'),
--        ('3e1b9f66-87c2-4a4f-bb87-8c1e923b7f8d', 'DrMad', '1234'),
--        ('74d2730e-51e5-4e42-a7d1-b91d1a6f3f1a', 'The_Honored_One', '1234'),
--        ('ff9b8d21-3ea4-4f0a-bb8f-c3d2a6f491c8', 'Rivers_King', '1234'),
--        ('1cfa873e-25d1-4e9f-b7c9-6e92d2b5a3f8', 'Gustave_Le_Rat', '1234'),
--        ('9c90b4c8-8f85-45f5-a3b3-c372f65b9c4a', 'Le_Maitre_du_Mal', '1234'),
--        ('a6c05755-0b6c-4677-b5a4-dc88cf8f2b73', 'Gobble', '1234'),
--        ('c40fe5b5-67a5-4a5b-bfad-66e84602e374', 'La_Terreur_Noir', '1234');
--
-- -- Insert messages
-- INSERT INTO messages (id, senderId, receiverId, content, createdAt)
-- VALUES ('b3a5f8cf-b0ac-4725-b7f1-3c72edb65b08', '1f8d37d2-0f29-4fbd-8db4-8d5c9871aee0',
--         '3e1b9f66-87c2-4a4f-bb87-8c1e923b7f8d', 'Salut Dr.Mad, comment ça va ?', '2025-02-14T14:00:00.000Z'),
--        ('c17e1d1a-5156-46a3-9d91-b343c6f66e89', '3e1b9f66-87c2-4a4f-bb87-8c1e923b7f8d',
--         '1f8d37d2-0f29-4fbd-8db4-8d5c9871aee0', 'Bien et toi Larry ?', '2025-02-15T14:05:00.000Z'),
--        ('f2685a7a-8a8e-4ff6-924a-4c5b9d3d4729', '74d2730e-51e5-4e42-a7d1-b91d1a6f3f1a',
--         'ff9b8d21-3ea4-4f0a-bb8f-c3d2a6f491c8', 'Yo Kench, toujours aussi gourmand ?', '2025-02-16T14:10:00.000Z'),
--        ('41fd8cfe-dcb0-44e0-b7a7-3d3c9e4e4b65', 'ff9b8d21-3ea4-4f0a-bb8f-c3d2a6f491c8',
--         '74d2730e-51e5-4e42-a7d1-b91d1a6f3f1a', 'Toujours, mon cher Gojo. Tu veux un contrat ?',
--         '2025-02-17T14:15:00.000Z'),
--        ('92a74e1b-c0f9-4a62-bf7b-8f7ac7023a21', '1cfa873e-25d1-4e9f-b7c9-6e92d2b5a3f8',
--         '3e1b9f66-87c2-4a4f-bb87-8c1e923b7f8d', 'Docteur, j’ai un rat enrhumé, un remède ?',
--         '2025-02-18T14:20:00.000Z'),
--        ('1bbd8bdf-e3ea-423d-9cf9-520b6b8eae57', '3e1b9f66-87c2-4a4f-bb87-8c1e923b7f8d',
--         '1cfa873e-25d1-4e9f-b7c9-6e92d2b5a3f8', 'Un virus en bouteille, ça t’intéresse ?', '2025-02-19T14:25:00.000Z'),
--        ('db34f577-97f0-4972-8b2f-f31c7fa327b6', '1f8d37d2-0f29-4fbd-8db4-8d5c9871aee0',
--         '74d2730e-51e5-4e42-a7d1-b91d1a6f3f1a', 'Satoru, t’es toujours le plus fort ?', '2025-02-20T14:30:00.000Z'),
--        ('b132db0c-2f5a-4bdf-8c68-3f0d84f9a233', '74d2730e-51e5-4e42-a7d1-b91d1a6f3f1a',
--         '1f8d37d2-0f29-4fbd-8db4-8d5c9871aee0', 'Évidemment, qui pourrait me battre ?', '2025-02-21T14:35:00.000Z'),
--        ('d8b9a8ac-0fd2-4569-bf8f-d6cc49cf3db1', 'ff9b8d21-3ea4-4f0a-bb8f-c3d2a6f491c8',
--         '1cfa873e-25d1-4e9f-b7c9-6e92d2b5a3f8', 'T’as vu les dernières updates sur les rats ?',
--         '2025-02-22T14:40:00.000Z'),
--        ('d7b5686b-d998-4a71-a739-08f7c6e6f6f3', '1cfa873e-25d1-4e9f-b7c9-6e92d2b5a3f8',
--         'ff9b8d21-3ea4-4f0a-bb8f-c3d2a6f491c8', 'Pas encore, mais je vais me renseigner.', '2025-02-23T14:45:00.000Z');
