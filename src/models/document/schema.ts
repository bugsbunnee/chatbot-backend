export interface IDocumentEnquiry {
    question: string;
    response: string;
}

export interface IDocument {
    fileName: string;
    content: string;
    enquiries: IDocumentEnquiry[];
}