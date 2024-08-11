import { HTMLInputTypeAttribute, useState } from 'react';
import './ProjectTableRow.style.sass';
import FileIcon from '@img/file.svg';
import TrashIcon from '@img/trash.svg';
import { EntityTree } from '@/store/treeRows';
import { IRow, ITree } from '@/model/types';

interface IProjectTableRow {
	level: number;
	row: ITree;
}

interface rowData extends Partial<IRow> {
	[key: string]: string | number | undefined;
}

export default function ProjectTableRow({ row, level }: IProjectTableRow) {
	const tree = EntityTree;
	const [rowData, setRowData] = useState<ITree>(row);
	const [isEditable, setIsEditable] = useState<boolean>(row.isNowCreate ?? false);
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
				if (row.isNowCreate) {
					tree.saveRow(rowData);
					notChangeRow();
					return;
				}
				tree.updateRow(rowData);
				notChangeRow();
			}
			if (e.key === 'Escape') {
				notChangeRow();
				return;
			}
		};
	} else {
		window.onkeyup = null;
	}

	const createRow = () => {
		if (tree.getIsNowEdited || isEditable) return;
		tree.setIsNowEdited(true);
		tree.addRow(rowData);
	};

	const deleteRow = () => {
		if (isEditable) return;
		tree.deleteRow(row);
	};

	const changeField = (e: React.ChangeEvent<HTMLInputElement>) => {
		const t = e.currentTarget;
		const rowField = t.dataset.rowField;
		if (rowField === undefined) return;
		const rowData: rowData = {};
		rowData[rowField] =
			(t.type as HTMLInputTypeAttribute) === 'number' ? Number(t.value) : t.value;
		setRowData((v) => {
			const newV = { ...v, ...rowData } as ITree;
			return newV;
		});
	};

	const inputProps = {
		type: 'number',
		onChange: changeField,
		onDoubleClick: changeRow,
		readOnly: !isEditable,
	};

	return (
		<tr className="table-tr">
			<td className="table-tr__level" style={{ paddingLeft: level * 20 + 12 }}>
				{level !== 0 && (
					<span className="level-lines" style={{ left: level * 20 + 4 }}></span>
				)}
				<div className={isEditable ? 'no-active' : ''}>
					<button type="button" className="table-tr__file" onClick={createRow}>
						<img src={FileIcon} alt="" />
					</button>
					<button type="button" className="table-tr__trash" onClick={deleteRow}>
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
					defaultValue={row.rowName}
				/>
			</td>
			<td>
				<input
					{...inputProps}
					data-row-field="mainCosts"
					defaultValue={row.mainCosts}
				/>
			</td>
			<td>
				<input
					{...inputProps}
					data-row-field="overheads"
					defaultValue={row.overheads}
				/>
			</td>
			<td>
				<input
					{...inputProps}
					data-row-field="equipmentCosts"
					defaultValue={row.equipmentCosts}
				/>
			</td>
			<td>
				<input
					{...inputProps}
					data-row-field="estimatedProfit"
					defaultValue={row.estimatedProfit}
				/>
			</td>
		</tr>
	);
}
