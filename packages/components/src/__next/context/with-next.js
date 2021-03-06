/**
 * External dependencies
 */
import { contextConnect, useContextSystem } from '@wp-g2/context';

/**
 * @template {{}} TCurrentProps
 * @template {{}} TNextProps
 * @param {import('react').ComponentType<TCurrentProps>} CurrentComponent
 * @param {import('react').ComponentType<TNextProps>} NextComponent
 * @param {string} namespace
 * @param {(props: TCurrentProps) => TNextProps} adapter
 */
export function withNext(
	CurrentComponent = () => null,
	NextComponent = () => null,
	namespace = 'Component',
	adapter = ( p ) => /** @type {any} */ ( p )
) {
	if ( process.env.COMPONENT_SYSTEM_PHASE === 1 ) {
		/* eslint-disable jsdoc/no-undefined-types */
		/**
		 * @param {TCurrentProps} props
		 * @param {import('react').Ref<any>} ref
		 */
		/* eslint-enable jsdoc/no-undefined-types */
		const WrappedComponent = ( props, ref ) => {
			// @ts-ignore
			const { __unstableVersion, ...otherProps } = useContextSystem(
				props,
				namespace
			);

			if ( __unstableVersion === 'next' ) {
				// @ts-ignore
				const nextProps = adapter( otherProps );
				return <NextComponent { ...nextProps } ref={ ref } />;
			}

			return <CurrentComponent { ...props } ref={ ref } />;
		};

		return contextConnect( WrappedComponent, namespace );
	}

	return CurrentComponent;
}
