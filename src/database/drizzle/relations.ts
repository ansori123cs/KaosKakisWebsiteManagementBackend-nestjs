import { relations } from "drizzle-orm/relations";
import { itemVariant, stock, material, kaosKaki, color, size, itemMachine, machine } from "./schema";

export const stockRelations = relations(stock, ({one}) => ({
	itemVariant: one(itemVariant, {
		fields: [stock.id],
		references: [itemVariant.id]
	}),
}));

export const itemVariantRelations = relations(itemVariant, ({one, many}) => ({
	stocks: many(stock),
	kaosKaki: one(kaosKaki, {
		fields: [itemVariant.item],
		references: [kaosKaki.id]
	}),
	color: one(color, {
		fields: [itemVariant.color],
		references: [color.id]
	}),
	size: one(size, {
		fields: [itemVariant.size],
		references: [size.id]
	}),
}));

export const kaosKakiRelations = relations(kaosKaki, ({one, many}) => ({
	material: one(material, {
		fields: [kaosKaki.material],
		references: [material.id]
	}),
	itemVariants: many(itemVariant),
	itemMachines: many(itemMachine),
}));

export const materialRelations = relations(material, ({many}) => ({
	kaosKakis: many(kaosKaki),
}));

export const colorRelations = relations(color, ({many}) => ({
	itemVariants: many(itemVariant),
}));

export const sizeRelations = relations(size, ({many}) => ({
	itemVariants: many(itemVariant),
}));

export const itemMachineRelations = relations(itemMachine, ({one}) => ({
	kaosKaki: one(kaosKaki, {
		fields: [itemMachine.item],
		references: [kaosKaki.id]
	}),
	machine: one(machine, {
		fields: [itemMachine.machine],
		references: [machine.id]
	}),
}));

export const machineRelations = relations(machine, ({many}) => ({
	itemMachines: many(itemMachine),
}));