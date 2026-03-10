import { error } from "console";

export class TagName {
    private value: string;

    constructor(input: string) {
        this.validate(input);
        this.value = input;
    }

    private validate(input: string) {
        if (input.length === 0) {
            throw new Error('Content cannot be empty');
        }

        if (input !== input.toLowerCase().trim()) {
            throw new Error('Tag must be lowercase and cannot have leading or trailing spaces');
        }

        if (input.length < 2 || input.length > 50) {
            throw new Error('Tag must be between 2 and 50 characters');
        }

        if (!/^[a-z0-9-]+$/.test(input)) {
            throw new Error('Tag can only contain lowercase letters, numbers, and hyphens');
        }
    }

    public toString() {
        return this.value;
    }
}