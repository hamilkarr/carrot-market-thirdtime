interface FormButtonProps { 
    text: string;
    isLoading: boolean;
}

export const FormButton = ({ text, isLoading }: FormButtonProps) => {
    return (
        <button className="primary-btn h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed" disabled={isLoading}>{isLoading ? '로딩 중' : text}</button>
    )
}