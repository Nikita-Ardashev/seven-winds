import { HTMLInputTypeAttribute, useRef, useState } from 'react';
import './ProjectTableRow.style.sass';
import FileIcon from '@img/file.svg';
import TrashIcon from '@img/trash.svg';
import { IRowResponse, ITreeResponse } from '@/model/types';
import { treeRows } from '@/store/treeRows';
import { IAnyModelType, IMSTArray } from 'mobx-state-tree';

interface IProjectTableRow {
	level: number;
	row: IRowResponse;
	isNowCreate: boolean | null;
}

export default function ProjectTableRow({ row, level, isNowCreate }: IProjectTableRow) {
	const tree = treeRows;
	const { rowName, mainCosts, equipmentCosts, overheads, estimatedProfit, id } = row;
	const [newRowData, setNewRowData] = useState<ITreeResponse | null>(null);
	const [isEditable, setIsEditable] = useState<boolean>(isNowCreate ?? false);

	const changeRow = () => {
		tree.setIsNowEdited(true);
		setIsEditable(true);
	};
	const notChangeRow = () => {
		tree.setIsNowEdited(false);
		setIsEditable(false);
	};

	if (isEditable) {
		window.onkeyup = (e) => {
			if (e.key === 'Enter') {
				notChangeRow();
				if (isNowCreate) {
					tree.saveTreeRow(id);
				} else {
					tree.updateTreeRow(id, newRowData);
				}
			}
		};
	} else {
		window.onkeyup = null;
	}

	const createLevel = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (tree.getIsNowEdited) return;
		e.currentTarget.blur();
		if (isEditable) return;
		tree.setIsNowEdited(true);
		tree.addTreeRow(
			{
				child: [] as unknown as IMSTArray<IAnyModelType>,
				id: 0,
				parentId: 0,
				rowName: '',
				equipmentCosts: 0,
				estimatedProfit: 0,
				machineOperatorSalary: 0,
				mainCosts: 0,
				materials: 0,
				mimExploitation: 0,
				overheads: 0,
				salary: 0,
				supportCosts: 0,
				total: 0,
				level,
				isNowCreate: true,
			},
			id,
		);
	};

	const deleteLevel = () => {
		if (isEditable) return;
		tree.deleteTreeRow(id);
	};

	const changeField = (e: React.ChangeEvent<HTMLInputElement>) => {
		const t = e.currentTarget;
		const rowField = t.dataset.rowField;
		if (rowField === undefined) return;
		const rowData: Record<string, string | number> = {};
		rowData[rowField] =
			(t.type as HTMLInputTypeAttribute) === 'number' ? Number(t.value) : t.value;
		setNewRowData((v) => {
			const newV = { ...v, ...rowData };
			console.log(newV);
			return newV as ITreeResponse;
		});
	};

	const inputProps = {
		onChange: changeField,
		onDoubleClick: changeRow,
		readOnly: !isEditable,
		required: true,
	};

	return (
		<tr className="table-tr">
			<td className={`table-tr__level level-${level}`}>
				<div className={isEditable ? 'no-active' : ''}>
					<button type="button" className="table-tr__file" onClick={createLevel}>
						<img src={FileIcon} alt="" />
					</button>
					<button type="button" className="table-tr__trash" onClick={deleteLevel}>
						<img src={TrashIcon} alt="" />
					</button>
				</div>
			</td>
			<td>
				<input
					{...inputProps}
					type="text"
					maxLength={128}
					data-row-field="rowName"
					defaultValue={rowName}
				/>
			</td>
			<td>
				<input
					{...inputProps}
					type="number"
					data-row-field="mainCosts"
					defaultValue={mainCosts}
				/>
			</td>
			<td>
				<input
					{...inputProps}
					type="number"
					data-row-field="overheads"
					defaultValue={overheads}
				/>
			</td>
			<td>
				<input
					{...inputProps}
					type="number"
					data-row-field="equipmentCosts"
					defaultValue={equipmentCosts}
				/>
			</td>
			<td>
				<input
					{...inputProps}
					type="number"
					data-row-field="estimatedProfit"
					defaultValue={estimatedProfit}
				/>
			</td>
		</tr>
	);
}
