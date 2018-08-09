import { Visibility } from "ui/enums";

import * as moment from "moment";

export function booleanVisibilityConverter(value: boolean): string {
    return value ? Visibility.visible : Visibility.collapse;
}

export function dataVisibilityConverter(value: string): string {
    return value === "" || value === undefined || value === null ? Visibility.collapse : Visibility.visible;
}

export function dataInverseVisibilityConverter(value: string): string {
    return value === "" || value === undefined || value === null ? Visibility.visible : Visibility.collapse;
}

export function formatDate(date: Date | string, format: string, emptyValue: string = " "): string { // NOTE: Do not use empty string as then labels get 0 height!
    return date ? moment(date).format(format) : emptyValue;
}

export function formatNumber(num: number, precision: number): string {
    if (!num) {
        num = 0;
    }

    return num.toFixed(precision);
}