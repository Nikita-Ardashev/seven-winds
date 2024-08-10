import {
	IEntityResponse,
	IOutlayRowRequest,
	IOutlayRowUpdateRequest,
	IRecalculatedRows,
	ITree,
} from './types';

const API = 'http://185.244.172.108:8081';
export const EID = 137860;

export const createEntity = async (): Promise<IEntityResponse> => {
	const req = await fetch(API + `/v1/outlay-rows/entity/create`, {
		method: 'post',
	});
	const result = await req.json();
	return result;
};

export const createRowInEntity = async (
	body: IOutlayRowRequest,
): Promise<IRecalculatedRows> => {
	const newBody = { ...body };
	delete newBody.total;
	delete newBody.id;
	delete newBody.child;

	const req = await fetch(API + `/v1/outlay-rows/entity/${EID}/row/create`, {
		method: 'post',
		body: JSON.stringify(newBody),
		headers: { 'Content-Type': 'application/json' },
	});
	const result = await req.json();
	return result;
};

export const updateRow = async (
	rID: number,
	body: IOutlayRowUpdateRequest,
): Promise<IRecalculatedRows> => {
	const req = await fetch(API + `/v1/outlay-rows/entity/${EID}/row/${rID}/update`, {
		method: 'post',
		body: JSON.stringify(body),
		headers: { 'Content-Type': 'application/json' },
	});
	const result = await req.json();
	return result;
};

export const deleteRow = async (rID: number): Promise<IRecalculatedRows> => {
	const req = await fetch(API + `/v1/outlay-rows/entity/${EID}/row/${rID}/delete`, {
		method: 'delete',
	});
	const result = await req.json();
	return result;
};

export const getTreeRows = async (): Promise<ITree['tree']> => {
	const req = await fetch(API + `/v1/outlay-rows/entity/${EID}/row/list`, {
		method: 'get',
	});
	const result = await req.json();
	return result;
};
