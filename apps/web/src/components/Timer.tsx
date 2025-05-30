interface Props {
    text: string;
    time: number;
}

function Timer({ text, time }: Props) {
    return (
        <div>
            {text} {time}s
        </div>
    );
}

export default Timer;
