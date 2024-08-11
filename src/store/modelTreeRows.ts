import { createRowInEntity, deleteRow, updateRow } from '@/model/api.service';
import {
	cast,
	destroy,
	flow,
	IAnyModelType,
	IMSTArray,
	Instance,
	types,
} from 'mobx-state-tree';

export const modelEntity = types.model({
	id: types.number,
	rowName: types.string,
});

export const modelRow = types.compose(
	types.model({
		equipmentCosts: types.number,
		estimatedProfit: types.number,
		mainCosts: types.number,
		overheads: types.number,
	}),
	modelEntity,
);

export const modelFullRow = types.compose(
	modelRow,
	types.model({
		machineOperatorSalary: types.number,
		materials: types.number,
		mimExploitation: types.number,
		salary: types.number,
		supportCosts: types.number,
		parentId: types.maybe(types.number),
	}),
);

export const modelTree = types.compose(
	types.model({
		child: types.array(types.late((): IAnyModelType => modelTree)),
		isNowCreate: types.maybe(types.boolean),
		total: types.number,
	}),
	modelFullRow,
);

export const modelEntityTree = types
	.model({
		tree: types.array(modelTree),
		isNowEdited: types.boolean,
	})
	.views((self) => ({
		get getTree() {
			return self.tree;
		},
		get getIsNowEdited() {
			return self.isNowEdited;
		},
	}))
	.actions((self) => ({
		setTree(newTree: Instance<typeof modelTree>[]) {
			self.tree = cast(newTree);
		},
		setIsNowEdited(isNowEdited: boolean) {
			self.isNowEdited = isNowEdited;
		},
		setIsNowCreate(row: Instance<typeof modelTree>, isNowCreate: boolean) {
			row.isNowCreate = isNowCreate;
		},
		addRow(parentRow: Instance<typeof modelTree>) {
			const row: Instance<typeof modelTree> = {
				equipmentCosts: 0,
				estimatedProfit: 0,
				mainCosts: 0,
				overheads: 0,
				rowName: '',
				parentId: parentRow.id,
				child: [] as unknown as IMSTArray<IAnyModelType>,
				id: 0,
				machineOperatorSalary: 0,
				materials: 0,
				mimExploitation: 0,
				salary: 0,
				supportCosts: 0,
				total: 0,
				isNowCreate: true,
			};
			parentRow.child.push(row);
		},

		saveRow: flow(function* (row: Instance<typeof modelTree>) {
			try {
				const r = yield createRowInEntity(row);
				row.isNowCreate = false;
				Object.assign(row, r.current);
			} catch (e) {
				console.error(e);
			}
		}),

		updateRow: flow(function* (row: Instance<typeof modelTree>) {
			try {
				const r = yield updateRow(row);
				Object.assign(row, r.current);
			} catch (e) {
				console.error(e);
			}
		}),

		deleteRow(row: Instance<typeof modelTree>) {
			deleteRow(row.id);
			destroy(row);
		},
	}));
