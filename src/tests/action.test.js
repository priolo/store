import React from 'react'
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { getStore, MultiStoreProvider, setupStore, useStore } from '../lib/store/rvxProviders'


beforeEach(() => {
	// create CONTEXT and STORE
	setupStore({ myStore: setupMyStore })
})

test('simply getStore', async () => {

	render(<MultiStoreProvider><TestView /></MultiStoreProvider>)

	// get myStore with reducer
	const myStoreWithReducer = getStore("myStore")
	expect(myStoreWithReducer.state.value).toBe("init value")

	// change state value with reducer
	await act(async () => myStoreWithReducer.fetch())

	expect(screen.getByTestId('view')).toHaveTextContent("new value")
})

test('simply useStore', async () => {

	render(<MultiStoreProvider><TestView /></MultiStoreProvider>)

	// get myStore with reducer
	const myStoreWithReducer = getStore("myStore")
	expect(myStoreWithReducer.state.value).toBe("init value")

	// change state value with event
	fireEvent.click(screen.getByText('click'))

	waitFor(()=>expect(screen.getByTestId('view')).toHaveTextContent("new value"))
})

const setupMyStore = {
	state: {
		value: "init value",
	},
	actions: {
		fetch: async (state, payload, store) => {
			// simulate http response
			await new Promise((res)=>setTimeout(res,1000))
			store.setValue("new value")
		}
	},
	mutators: {
		setValue: (state, value) => {
			return { value }
		},
	},
}

function TestView() {

	const { state, setValue } = useStore("myStore")

	return (<div>
		<button onClick={() => fetch()}>click</button>
		<div data-testid="view">{state.value}</div>
	</div>)
}
