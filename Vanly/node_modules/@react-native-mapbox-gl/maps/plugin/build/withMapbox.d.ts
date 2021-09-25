import { ConfigPlugin, XcodeProject } from '@expo/config-plugins';
declare type InstallerBlockName = 'pre' | 'post';
export declare function applyCocoaPodsModifications(contents: string): string;
export declare function addInstallerBlock(src: string, blockName: InstallerBlockName): string;
export declare function addMapboxInstallerBlock(src: string, blockName: InstallerBlockName): string;
/**
 * Exclude building for arm64 on simulator devices in the pbxproj project.
 * Without this, production builds targeting simulators will fail.
 */
export declare function setExcludedArchitectures(project: XcodeProject): XcodeProject;
declare const _default: ConfigPlugin<void>;
export default _default;
