import {CheckCircle2, XCircle} from "lucide-react";

type PasswordCriteriaProps = {
    text: string;
    met: boolean;
};

export default function PasswordCriteria(props: PasswordCriteriaProps) {
    let divClasses = "flex items-center transition-colors duration-200";
    divClasses += props.met ? " text-green-600" : " text-gray-500";

    return (
        <div className={divClasses}>
            {props.met
                ? <CheckCircle2 size={14} className="mr-2 flex-shrink-0"/>
                : <XCircle size={14} className="mr-2 flex-shrink-0"/>
            }
            <span>{props.text}</span>
        </div>
    );
};