export interface IDocumentHistory { 
    version: number; 
    content: string;
    url: string;
}

export interface IDocument {
    createdAt: Date;
    updatedAt: Date;
    lastInsertedVersion: number;
    documentNumber: string;
    name: string;
    tags: string[];
    history: IDocumentHistory[];
}

export interface IDocumentMethods {
    readLastTextContent: () => string;
}