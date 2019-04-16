import React from 'react';
import renderer from 'react-test-renderer';
import SuitButton from './SuitButton';

test('Changes when active', () => {
	const comp = renderer.create(
		<SuitButton active={true} suit={'hearts'}/>
	);

	let tree = comp.toJSON();
	expect(tree).toMatchSnapshot();

	tree.props.active = false;

	tree = comp.toJSON();
	expect(tree).toMatchSnapshot();
});