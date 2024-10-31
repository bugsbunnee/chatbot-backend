export interface IDocumentHistory { 
    type: 'pdf';
    version: number; 
    url: string;
}

export interface IDocument {
    isAnalyzed: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastInsertedVersion: number;
    documentNumber: string;
    name: string;
    tags: string[];
    history: IDocumentHistory[];
}

export interface IDocumentMethods {
    getLastEntry: () => IDocumentHistory | undefined;
}