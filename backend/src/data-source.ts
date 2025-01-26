import { DataSource } from "typeorm"
import { User } from "./users/user.entity"
import { NoteCard } from "./notecards/notecard.entity"
import { AddYouTubeFields1737553544052 } from "./migrations/1737553544052-AddYouTubeFields"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "Shloimy-Yona",
    database: "thinker_data",
    synchronize: false,
    logging: true,
    entities: [User, NoteCard],
    migrations: [AddYouTubeFields1737553544052],
    subscribers: [],
}) 