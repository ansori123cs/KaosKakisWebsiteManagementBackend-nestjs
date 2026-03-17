import { pgTable, foreignKey, uuid, text, boolean, timestamp, integer, smallint, unique, varchar } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const itemFile = pgTable("item-file", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	item: uuid(),
	url: text(),
	isPrimary: boolean("is_primary").default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.item],
			foreignColumns: [kaosKaki.id],
			name: "item-file_item_fkey"
		}),
]);

export const stock = pgTable("stock", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	ammount: integer(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	isDeleted: timestamp("is_deleted", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	userDeleted: text("user_deleted"),
	itemVariant: uuid("item-variant").defaultRandom(),
	status: smallint(),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [itemVariant.id],
			name: "stock_id_fkey"
		}),
]);

export const material = pgTable("material", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	code: varchar().notNull(),
	name: varchar(),
	description: varchar(),
	status: smallint(),
	isDeleted: boolean("is_deleted"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	userDeleted: text("user_deleted"),
}, (table) => [
	unique("material_code_key").on(table.code),
]);

export const machine = pgTable("machine", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	code: varchar().notNull(),
	name: varchar(),
	description: varchar(),
	status: smallint(),
	isDeleted: boolean("is_deleted"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	userDeleted: text("user_deleted"),
}, (table) => [
	unique("machine_code_key").on(table.code),
]);

export const size = pgTable("size", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	code: varchar().notNull(),
	name: varchar(),
	description: varchar(),
	status: smallint(),
	isDeleted: boolean("is_deleted"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	userDeleted: text("user_deleted"),
}, (table) => [
	unique("size_code_key").on(table.code),
]);

export const color = pgTable("color", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	code: varchar().notNull(),
	name: varchar(),
	description: varchar(),
	status: smallint(),
	isDeleted: boolean("is_deleted"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	userDeleted: text("user_deleted"),
}, (table) => [
	unique("color_code_key").on(table.code),
]);

export const customer = pgTable("customer", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text(),
	note: text(),
	phone: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	isDeleted: boolean("is_deleted"),
	status: smallint(),
});

export const order = pgTable("order", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	note: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	isDeleted: timestamp("is_deleted", { withTimezone: true, mode: 'string' }),
	userDeleted: text("user_deleted"),
	status: smallint(),
	customer: uuid(),
});

export const kaosKaki = pgTable("kaos-kaki", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	code: varchar(),
	name: varchar(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	userDeleted: text("user_deleted"),
	material: uuid(),
	isDeleted: boolean("is_deleted"),
	status: smallint(),
}, (table) => [
	foreignKey({
			columns: [table.material],
			foreignColumns: [material.id],
			name: "kaos-kaki_material_fkey"
		}).onUpdate("restrict").onDelete("restrict"),
	unique("kaos-kaki_code_key").on(table.code),
]);

export const itemVariant = pgTable("item-variant", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	isDeleted: boolean("is_deleted"),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	color: uuid(),
	size: uuid(),
	userDeleted: text("user_deleted"),
	item: uuid(),
	status: smallint(),
}, (table) => [
	foreignKey({
			columns: [table.item],
			foreignColumns: [kaosKaki.id],
			name: "item-variant_item_fkey"
		}),
	foreignKey({
			columns: [table.color],
			foreignColumns: [color.id],
			name: "item-variation_color_fkey"
		}).onUpdate("restrict").onDelete("restrict"),
	foreignKey({
			columns: [table.size],
			foreignColumns: [size.id],
			name: "item-variation_size_fkey"
		}).onUpdate("restrict").onDelete("restrict"),
]);

export const orderDetails = pgTable("order-details", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	price: integer(),
	amount: integer(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
	isDeleted: boolean("is_deleted"),
	userDeleted: text("user_deleted"),
	status: smallint(),
	order: uuid(),
	itemVariant: uuid("item-variant"),
}, (table) => [
	foreignKey({
			columns: [table.itemVariant],
			foreignColumns: [itemVariant.id],
			name: "order-details_item-variant_fkey"
		}),
	foreignKey({
			columns: [table.order],
			foreignColumns: [order.id],
			name: "order-details_order_fkey"
		}),
]);

export const itemMachine = pgTable("item-machine", {
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted-at", { withTimezone: true, mode: 'string' }),
	userDeleted: varchar("user_deleted"),
	machine: uuid(),
	id: uuid().defaultRandom().primaryKey().notNull(),
	item: uuid(),
	status: smallint(),
	isDeleted: boolean("is_deleted"),
}, (table) => [
	foreignKey({
			columns: [table.item],
			foreignColumns: [kaosKaki.id],
			name: "item-machine_item_fkey"
		}),
	foreignKey({
			columns: [table.machine],
			foreignColumns: [machine.id],
			name: "item-machine_machine_fkey"
		}).onUpdate("restrict").onDelete("restrict"),
	unique("item-machine_id_key").on(table.id),
]);
