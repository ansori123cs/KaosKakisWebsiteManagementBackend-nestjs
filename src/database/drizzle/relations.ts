import { relations } from "drizzle-orm/relations";
import { kaosKaki, itemFile, itemVariant, stock, material, color, size, orderDetails, order, itemMachine, machine } from "./schema";

export const itemFileRelations = relations(itemFile, ({one}) => ({
	kaosKaki: one(kaosKaki, {
		fields: [itemFile.item],
		references: [kaosKaki.id]
	}),
}));

export const kaosKakiRelations = relations(kaosKaki, ({one, many}) => ({
	itemFiles: many(itemFile),
	material: one(material, {
		fields: [kaosKaki.material],
		references: [material.id]
	}),
	itemVariants: many(itemVariant),
	itemMachines: many(itemMachine),
}));

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
	orderDetails: many(orderDetails),
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

export const orderDetailsRelations = relations(orderDetails, ({one}) => ({
	itemVariant: one(itemVariant, {
		fields: [orderDetails.itemVariant],
		references: [itemVariant.id]
	}),
	order: one(order, {
		fields: [orderDetails.order],
		references: [order.id]
	}),
}));

export const orderRelations = relations(order, ({many}) => ({
	orderDetails: many(orderDetails),
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