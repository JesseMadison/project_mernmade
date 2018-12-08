import React, { Component } from 'react';
import { Input } from 'react-materialize';

export default class CustomInput extends Component {
    render() {
        const { input: { value, onChange } } = this.props;
        return (
            <div className="form-group">
                <Input
                    label={this.props.label}
                    name={this.props.name}
                    id={this.props.id}
                    className="form-control"
                    type={this.props.type}
                    s={this.props.s}
                    placeholder={this.props.placeholder}
                    value={value || this.props.defaultValue}
                    onChange={onChange}
                />
            </div>
        )
    }
}
