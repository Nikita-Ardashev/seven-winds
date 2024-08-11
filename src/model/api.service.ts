import { ICahgeRow, IEntity, IFullRow, IRow, ITree } from './types';

const API = 'http://185.244.172.108:8081';
export const EID = 137860;

export const createEntity = async (): Promise<IEntity> => {
	const req = await fetch(API + `/v1/outlay-rows/entity/create`, {
		method: 'post',
	});
	const result = await req.json();
	return result;
};

export const createRowInEntity = async (body: IEntity): Promise<ICahgeRow> => {
	const req = await fetch(API + `/v1/outlay-rows/entity/${EID}/row/create`, {
		method: 'post',
		body: JSON.stringify(body),
		headers: { 'Content-Type': 'application/json' },
	});
	const result = await req.json();
	return result;
};

export const updateRow = async (body: IFullRow): Promise<ICahgeRow> => {
	const req = await fetch(API + `/v1/outlay-rows/entity/${EID}/row/${body.id}/update`, {
		method: 'post',
		body: JSON.stringify(body),
		headers: { 'Content-Type': 'application/json' },
	});
	const result = await req.json();
	return result;
};

export const deleteRow = async (rID: number): Promise<ICahgeRow> => {
	const req = await fetch(API + `/v1/outlay-rows/entity/${EID}/row/${rID}/delete`, {
		method: 'delete',
	});
	const result = await req.json();
	return result;
};

export const getTreeRows = async (): Promise<ITree[]> => {
	const req = await fetch(API + `/v1/outlay-rows/entity/${EID}/row/list`, {
		method: 'get',
	});
	const result = await req.json();
	return result;
};
