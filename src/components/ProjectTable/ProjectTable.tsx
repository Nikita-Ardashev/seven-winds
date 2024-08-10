import { ITreeResponse } from '@/model/types';
import { ProjectTableRow } from '../ProjectTableRow';
import './ProjectTable.style.sass';
import { ReactNode } from 'react';
import React from 'react';
import { treeRows } from '@/store/treeRows';
import { observer } from 'mobx-react-lite';

export default function ProjectTable() {
	const tree = treeRows;
	const renderRows = (tree: ITreeResponse[], level: number): ReactNode => {
		const Rows = observer(() =>
			tree.map((r) => {
				return (
					<React.Fragment key={`parent-${r.id}`}>
						<ProjectTableRow
							level={level}
							row={r}
							key={r.id}
							isNowCreate={r.isNowCreate}
						/>
						{r.child.length !== 0 &&
							renderRows(r.child as ITreeResponse[], level + 1)}
					</React.Fragment>
				);
			}),
		);
		return <Rows />;
	};
	return (
		<table className="project-table">
			<thead>
				<tr>
					<th scope="col">Уровень</th>
					<th scope="col">Наименование работ</th>
					<th scope="col">Основная з/п</th>
					<th scope="col">Оборудование</th>
					<th scope="col">Накладные расходы</th>
					<th scope="col">Сметная прибыль</th>
				</tr>
			</thead>
			<tbody>{renderRows(tree.getTree, 1)}</tbody>
		</table>
	);
}
