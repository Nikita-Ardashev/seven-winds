import {
	modelEntityResponse,
	modelRecalculatedRows,
	modelRow,
	modelRowResponse,
	modelTreeResponse,
	modelTree,
	modelRowUpdate,
} from '@/store/modelTreeRows';
import { Instance } from 'mobx-state-tree';

export interface IEntityResponse extends Instance<typeof modelEntityResponse> {}

export interface IOutlayRowUpdateRequest extends Instance<typeof modelRow> {}

export interface IRowResponse extends Instance<typeof modelRowResponse> {}

export interface IOutlayRowRequest extends Instance<typeof modelRowUpdate> {
	child: any;
	id: any;
	total: any;
}

export interface ITreeResponse extends Instance<typeof modelTreeResponse> {}

export interface ITree extends Instance<typeof modelTree> {}

export interface IRecalculatedRows extends Instance<typeof modelRecalculatedRows> {}
