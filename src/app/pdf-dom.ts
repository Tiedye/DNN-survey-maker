export type Margin = number|[number, number]|[number,number,number,number];
export type Orientation = 'portrait' | 'landscape';

export interface PDFDom {
    compress?: boolean,
    info?: {
        title?: string,
        author?: string,
        subject?: string,
        keywords?: string,
        creator?: string,
        producer?: string,
        creationDate?: string,
        modDate?: string,
        trapped?: string
    },
    content?: PDFNode;
    background?: PDFNode | ((page:number,pages:number)=>PDFNode);
    header?: PDFNode | ((page:number,pages:number,pageSize:{width:number,height:number,orientation:Orientation})=>PDFNode);
    footer?: PDFNode | ((page:number,pages:number,pageSize:{width:number,height:number,orientation:Orientation})=>PDFNode);
    watermark?: {text: string, color?: string, opacity?: number, font?: string, bold?: boolean, italics?: boolean}|string;
    images?: {[name:string]:string}
    defaultStyle?: PDFStyle;
    styles?: {[style:string]: PDFStyle};
    pageSize?: '4A0'|'2A0'|'A0'|'A1'|'A2'|'A3'|'A4'|'A5'|'A6'|'A7'|'A8'|'A9'|'A10'|'B0'|'B1'|'B2'|'B3'|'B4'|'B5'|'B6'|'B7'|'B8'|'B9'|'B10'|'C0'|'C1'|'C2'|'C3'|'C4'|'C5'|'C6'|'C7'|'C8'|'C9'|'C10'|'RA0'|'RA1'|'RA2'|'RA3'|'RA4'|'SRA0'|'SRA1'|'SRA2'|'SRA3'|'SRA4'|'EXECUTIVE'|'FOLIO'|'LEGAL'|'LETTER'|'TABLOID'|{width:number, height:number};
    pageMargins?: Margin;
    pageOrientation?: Orientation;
    maxPagesNumber?: number;
    pageBreakBefore?: (currentNode:PDFBreakNode, followingNodesOnPage:PDFBreakNode[], nodesOnNextPage:PDFBreakNode[], previousNodesOnPage:PDFBreakNode[]) => boolean;
}

export interface PDFStyle {
    margin?: Margin;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?:number;
    marginRight?:number;
    font?: string;
    fontSize?: number;
    bold?: boolean;
    italics?: boolean;
    alignment?: 'justify' | 'left' | 'center' | 'right';
    color?: string;
    columnGap?: number;
    fillColor?: string;
    decoration?: string;
    decorationStyle?: string;
    decorationColor?: string;
    background?: string;
    lineHeight?: number;
    characterSpacing?: number;
    noWrap?: boolean;
    markerColor?: string;
}

export type PDFText = PDFTextObject | PDFTextObject[] | string;
export interface PDFTextObject extends PDFStyle {
    id?: string;
    headlineLevel?:number;
    text?: PDFNode;
    style?: string;
    tocItem?: string[]|string|boolean;
    link?: string;
    linkToPage?: number;
}

export type PDFNode = PDFNodeObject | PDFNodeObject[] | string;
export interface PDFNodeObject extends PDFTextObject {
    absolutePosition?: {
        x: number,
        y: number
    }
    relativePosition?: {
        x: number,
        y: number
    }

    stack?: PDFNode[] | boolean; // hacky solution

    ul?: PDFNode[];
    ol?: PDFNode[];
    type?: 'disc'|'circle'|'square'|'none'|'decimal'|'upper-alpha'|'lower-alpha'|'upper-roman'|'lower-roman'|'none';
    separator?: string|[string|string];
    start?: number;
    reversed?: boolean;

    table?: PDFTable;
    layout?: PDFLayout|string;

    image?: string;
    width?: string | number;
    height?: string | number;
    minWidth?: string | number;
    maxWidth?: string | number;
    minHeight?: string | number;
    maxHeight?: string | number;
    fit?: [number, number];

    qr?: string;
    foreground?: string;
    background?: string;
    
    canvas?: null;

    columns?: PDFColumnNode[];

    toc?: {
        title?: PDFText;
        id?: string;
    }

    pageOrientation?: Orientation;
    pageBreak?: 'before';
}

export type PDFColumnNode = PDFColumnNodeObject | PDFColumnNodeObject[] | string;
export interface PDFColumnNodeObject extends PDFNodeObject {
    width?: string | number;
}
export type PDFTableNode = PDFTableNodeObject | PDFTableNodeObject[] | string;
export interface PDFTableNodeObject extends PDFNodeObject {
    rowSpan?: number;
    colSpan?: number;
    border?: [boolean, boolean, boolean, boolean];
}

export interface PDFBreakNode extends PDFNodeObject {
    pageNumbers: number[];
    pages: number;
    startPosition: {
        pageNumber: number;
        pageOrientation: Orientation;
        left: number;
        right: number;
        verticalRatio: number;
        horizontalRatio: number;
    }
}

export interface PDFTable {
    headerRows?: number;
    keepWithHeaderRows?: number;
    dontBreakRows?: boolean;
    widths?: (number|string)[];
    body?: PDFTableNode[][]
}
export interface PDFLayout {
    hLineWidth?: (i: number, node:PDFTableNode) => number|null;
    vLineWidth?: (i: number, node:PDFTableNode) => number|null;
    vLineColor?: ((i: number, node:PDFTableNode)=>string|null)|string;
    hLineColor?: ((i: number, node:PDFTableNode)=>string|null)|string;
    paddingLeft?: (i: number, node:PDFTableNode)=>number|null;
    paddingTop?: (i: number, node:PDFTableNode)=>number|null;
    paddingRight?: (i: number, node:PDFTableNode)=>number|null;
    paddingBottom?: (i: number, node:PDFTableNode)=>number|null;
    fillColor?: ((i: number,node:PDFTableNode)=>string|null)|string;
    defaultBorder?: boolean;
    hLineWhenBroken?: boolean;
}

export type PDFVector = PDFVecEllipse | PDFVecLine | PDFVecPath | PDFVecPolyline | PDFVecRect;
interface BaseVector {
    dash?: {
        length: number,
        space?: number,
        phase?: number
    },
    lineWidth?: number;
    lineJoin?: 'miter' | 'bevel' | 'round';
    color?: string;
    fillOpacity?: number;
    lineColor?: string;
    strokeOpacity?: number;
}
export interface PDFVecEllipse extends BaseVector {
    type: 'ellipse';
    x: number;
    y: number;
    r1: number;
    r2: number;
}
export interface PDFVecRect extends BaseVector {
    type: 'rect';
    x: number;
    y: number;
    w: number;
    h: number;
    r?: number;
    linearGradient?: string[];
}
export interface PDFVecLine extends BaseVector {
    type: 'line';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export interface PDFVecPolyline extends BaseVector {
    type: 'polyline';
    points: {x:number, y:number}[];
    closePath?: boolean;
}
export interface PDFVecPath extends BaseVector {
    type: 'path';
    d: string;
}