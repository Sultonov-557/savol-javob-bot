import { ConversationFlavor } from "@grammyjs/conversations";
import { Context } from "grammy";
import { User } from "../../database/entity/user.entity";

export type NewContext = Context & ConversationFlavor & { user: User };
