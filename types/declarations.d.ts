declare namespace JSX {
  interface Element {
    type: any;
    props: any;
    key: any;
  }
  interface ElementClass {
    render(): any;
  }
  interface ElementAttributesProperty {
    props: {};
  }
  interface ElementChildrenAttribute {
    children: {};
  }
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'react' {
  export type ReactNode = any;
  export type ReactElement<P = any, T = any> = any;
  export type Key = string | number;
  export type FC<P = {}> = (props: P) => any;
  export function forwardRef<T, P = {}>(render: (props: P, ref: any) => any): any;
  export function useState<T>(initialState?: T | (() => T)): [T, (val: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => any, deps?: readonly any[]): void;
  export function useMemo<T>(factory: () => T, deps?: readonly any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps?: readonly any[]): T;
  export function useRef<T>(initialValue?: T): { current: T };

  export interface SyntheticEvent<E = any, C = any> {
    target: C;
    currentTarget: C;
    preventDefault(): void;
    stopPropagation(): void;
  }
  export interface ChangeEvent<T = any> extends SyntheticEvent<any, T> {
    target: T & { value: string; checked?: boolean };
  }
  export interface FormEvent<T = any> extends SyntheticEvent<any, T> {}
  export interface KeyboardEvent<T = any> extends SyntheticEvent<any, T> {
    key: string;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
  }
  export interface MouseEvent<T = any> extends SyntheticEvent<any, T> {
    clientX: number;
    clientY: number;
  }
  export interface DragEvent<T = any> extends SyntheticEvent<any, T> {
    dataTransfer: {
      getData(format: string): string;
      setData(format: string, data: string): void;
    };
  }
  export interface HTMLAttributes<T> {
    className?: string;
    style?: any;
    onClick?: (e: MouseEvent<T>) => void;
    children?: ReactNode;
    [key: string]: any;
  }
  export interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean;
    type?: 'submit' | 'reset' | 'button';
  }
  export default React;
}

declare module 'react-dom' {
  export function render(...args: any[]): any;
}

declare module 'lucide-react' {
  export const Activity: any;
  export const AlertCircle: any;
  export const AlertTriangle: any;
  export const ArrowRight: any;
  export const ArrowUpDown: any;
  export const ArrowUpRight: any;
  export const Bell: any;
  export const Calendar: any;
  export const CheckCircle: any;
  export const CheckCircle2: any;
  export const CheckSquare: any;
  export const ChevronRight: any;
  export const Clock: any;
  export const Command: any;
  export const Filter: any;
  export const FolderKanban: any;
  export const HelpCircle: any;
  export const KanbanSquare: any;
  export const Layers: any;
  export const ListTodo: any;
  export const Mail: any;
  export const MessageSquare: any;
  export const Moon: any;
  export const MoreHorizontal: any;
  export const Plus: any;
  export const Search: any;
  export const Send: any;
  export const Shield: any;
  export const SlidersHorizontal: any;
  export const Sparkles: any;
  export const Sun: any;
  export const Tag: any;
  export const Trash2: any;
  export const TrendingUp: any;
  export const UserCheck: any;
  export const UserPlus: any;
  export const Users2: any;
  export const X: any;
  export const [key: string]: any;
}
