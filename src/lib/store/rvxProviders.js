import React, { useReducer } from 'react';
import { getApplyStore, createStore, useApplyStore } from './rvx';

// All the SETUP used to create the STORE
let setups
/* All the CONTEXT created in "setupStore"
contain the REDUCER of a STORE
are taken from the REACT components through a PROVIDER */
let contexts
// All the STORES created in "setupStore"
let stores
// all REDUCERS, are inside the CONTEXT, are created in "MultiStoreProvider"
const reducers = {}
const reducer = (state, action) => {
	return action(state);
};

/**
 * Initialization!
 * Create CONTEXTS and STORES from a SETUP-STORE dictionary
 * @param {*} stp SETUP-STORE dictionary
 */
export function setupStore(stp) {

	setups = stp

	contexts = Object.keys(setups).reduce((acc, p) => {
		acc[p] = React.createContext();
		acc[p].displayName = p
		return acc
	}, {})

	stores = Object.keys(setups).reduce((acc, p) => {
		acc[p] = createStore(setups[p]);
		return acc
	}, {})

}

/**
 * Returns a STORE by its name
 * It is useful for using a STORE outside a REACT COMPONENT
 * @param {string} storeName 
 * @param {any} bundle 
 */
export function getStore(storeName, bundle) {
	return getApplyStore(stores[storeName], reducers[storeName], bundle)
}

/**
 * Use a STORE by its name
 * It is useful for using a STORE in a REACT COMPONENT
 * @param {*} storeName 
 * @param {*} bundle 
 */
export function useStore(storeName, bundle) {
	return useApplyStore(stores[storeName], contexts[storeName], bundle)
}

/**
 * REACT PROVIDER that contains all REDUCERS
 * @param {*} param0 
 */
export const MultiStoreProvider = ({ providers, children }) => {

	if (providers == null) providers = Object.keys(setups)

	const prvs_c = [...providers]
	const provider = prvs_c.shift();

	const redux = useReducer(reducer, setups[provider].state);
	reducers[provider] = redux
	const context = contexts[provider]

	// return (<context.Provider value={redux}>
	// 	{prvs_c.length > 0 ? (
	// 		<MultiStoreProvider providers={prvs_c} children={children} />
	// 	) : (
	// 		children
	// 	)}
	// </context.Provider>)

	return React.createElement(context.Provider, {
		value: redux
	}, prvs_c.length > 0 ? React.createElement(MultiStoreProvider, {
		providers: prvs_c,
		children: children
	}) : children);
}