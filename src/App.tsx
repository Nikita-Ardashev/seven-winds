import './App.style.sass';
import MenuIcon from '@img/menu.svg';
import ShareIcon from '@img/share.svg';
import ArrowIcon from '@img/arrow.svg';
import { ManagementButton } from './components/ManagementButton';
import { Tab } from './components/Tab';
import ProjectTile from './components/ProjectTile/ProjectTile';
import { ProjectTable } from './components/ProjectTable';
import { useEffect } from 'react';
import { getTreeRows } from './model/api.service';
import { treeRows } from './store/treeRows';

// createEntity()
// 	.then((r) => {
// 		console.log(r);
// 	})
// 	.catch((e) => console.error(e));

export const PROJECTS: string[] = [
	'По проекту',
	'Объекты',
	'РД',
	'МТО',
	'СМР',
	'График',
	'МиМ',
	'Рабочие',
	'Капвложения',
	'Бюджет',
	'Финансирование',
	'Панорамы',
	'Камеры',
	'Поручения',
	'Контрагенты',
];

export default function App() {
	const tree = treeRows;
	useEffect(() => {
		getTreeRows()
			.then((r) => {
				tree.setTree(r);
			})
			.catch((e) => console.error(e));
	}, []);
	return (
		<>
			<div className="management">
				<ManagementButton content={<img src={MenuIcon} alt="Иконка меню" />} />
				<ManagementButton
					content={<img src={ShareIcon} alt="Иконка поделиться" />}
				/>
				<ManagementButton content={<p>Просмотр</p>} isSelect />
				<ManagementButton content={<p>Управление</p>} />
			</div>
			<div className="work-area">
				<div className="work-area__projects">
					<div className="work-area__projects-search">
						<div>
							<input type="text" placeholder="Название проекта" />
							<input type="text" placeholder="Аббревиатура" />
						</div>
						<button>
							<img src={ArrowIcon} alt="Иконка стрелки" />
						</button>
					</div>
					<div className="work-area__projects-tiles">
						{PROJECTS.map((p, i) => {
							return (
								<ProjectTile
									key={`${i}-${p}`}
									name={p}
									isSelect={p === 'СМР'}
								/>
							);
						})}
					</div>
				</div>
				<div className="work-area__project">
					<div className="work-area__project-tabs">
						<Tab title="Строительно-монтажные работы" />
					</div>
					<ProjectTable />
				</div>
			</div>
		</>
	);
}
