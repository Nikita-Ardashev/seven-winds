import { createRowInEntity, deleteRow, updateRow } from '@/model/api.service';
import { destroy, IAnyModelType, Instance, types } from 'mobx-state-tree';

export const modelEntityResponse = types.model({
	id: types.number,
	rowName: types.string,
});

export const modelRow = types.model({
	equipmentCosts: types.number,
	estimatedProfit: types.number,
	machineOperatorSalary: types.number,
	mainCosts: types.number,
	materials: types.number,
	mimExploitation: types.number,
	overheads: types.number,
	salary: types.number,
	supportCosts: types.number,
});

export const modelRowUpdate = types.compose(
	modelRow,
	types.model({ parentId: types.maybeNull(types.number) }),
);

export const modelRowResponse = types.compose(
	modelEntityResponse,
	modelRow,
	types.model({ total: types.number, parentId: types.maybeNull(types.number) }),
);

export const modelTreeResponse = types.compose(
	types.model({
		child: types.array(types.late((): IAnyModelType => modelTreeResponse)),
		level: types.maybeNull(types.number),
		isNowCreate: types.maybeNull(types.boolean),
	}),
	modelRowResponse,
);

export const modelTree = types
	.model({
		tree: types.array(modelTreeResponse),
		isNowEdited: types.boolean,
	})
	.views((self) => ({
		get getTree() {
			return self.tree;
		},
		get getIsNowEdited() {
			return self.isNowEdited;
		},
		getTreeRowById(id: number) {
			const recurse = (
				tree: typeof self.tree,
				id: number,
			): (typeof self.tree)[0] | null => {
				for (const node of tree) {
					if (node.id === id) {
						return node;
					}
					const foundChild = recurse(node.child, id);
					if (foundChild !== null) {
						return foundChild;
					}
				}
				return null;
			};
			return recurse(self.tree, id);
		},
	}))
	.actions((self) => ({
		setTree(newTree: typeof self.tree) {
			self.tree = newTree;
		},
		setIsNowEdited(isNowEdited: boolean) {
			self.isNowEdited = isNowEdited;
		},
		setIsNowCreate(isNowCreate: boolean, id: number) {
			const row = self.getTreeRowById(id);
			if (row === null) return;
			row.isNowCreate = isNowCreate;
		},
		addTreeRow(
			newRow: Omit<Instance<(typeof self.tree)[0]>, 'data'>,
			parentId: number,
		) {
			const row = self.getTreeRowById(parentId);
			if (row === null) return;
			row.child.unshift({ ...newRow, parentId });
		},

		saveTreeRow(id: number) {
			const row = self.getTreeRowById(id);
			if (row === null) return;
			createRowInEntity(row)
				.then((r) => {
					this.changeTreeRow(id, r.changed[0]);
				})
				.catch((e) => {
					console.error(e);
				});
		},

		updateTreeRow(id: number, newRow: (typeof self.tree)[0] | null) {
			if (newRow === null) return;
			updateRow(id, newRow)
				.then((r) => {
					this.changeTreeRow(id, r.changed[0]);
				})
				.catch((e) => {
					console.error(e);
				});
		},

		deleteTreeRow(id: number) {
			const row = self.getTreeRowById(id);
			deleteRow(id);
			destroy(row);
		},

		changeTreeRow(id: number, newRow: Partial<Instance<(typeof self.tree)[0]>>) {
			const row = self.getTreeRowById(id);
			if (row === null || newRow === undefined) return;
			Object.assign(row, newRow);
			return row;
		},
	}));

export const modelRecalculatedRows = types.model({
	changed: types.array(modelRowResponse),
	current: modelRowResponse,
});
