import React from 'react';
import renderer from 'react-test-renderer';
import ScoreList from './ScoreList';

test('Changes when difficulty, seconds, and mistakes change', () => {
	const comp = renderer.create(
		<ScoreList bestTimes={{easy: [{seconds: 100, mistakes: 2}]}}/>
	);

	let tree = comp.toJSON();
	expect(tree).toMatchSnapshot();

	tree.props.bestTimes = {
		medium: [{seconds: 105, mistakes: 1}]
	};
	tree = comp.toJSON();
	expect(tree).toMatchSnapshot();
});