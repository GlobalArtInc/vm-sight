import {
    registerDecorator,
    ValidationArguments, ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import {UsersModel} from "../models";

@ValidatorConstraint({async: true})
export class UniqueUsernameConstraint implements ValidatorConstraintInterface {
    async validate(username: any, args: ValidationArguments) {
        const user = await UsersModel.findOne({where: {username}})
        return !user;
    }
}

export function Unique(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: UniqueUsernameConstraint
        });
    };
}
