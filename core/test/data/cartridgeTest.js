/* eslint-env mocha */
/* eslint-disable no-sparse-arrays, no-unused-expressions */

import fs from 'fs';
import {expect} from 'chai';
import JSZip from 'jszip';
import Mirroring from '../../src/common/Mirroring';
import Region from '../../src/common/Region';
import {readCartridge, createCartridge} from '../../src/data/cartridge';

describe('data/cartridge', () => {
  let romData, zipData;

  before(() => {
    romData = new Uint8Array(fs.readFileSync('./test/roms/nestest/nestest.nes'));
    zipData = new Uint8Array(fs.readFileSync('./test/roms/nestest/nestest.zip'));
  });

  it('acceppts valid data type', () => {
    expect(createCartridge(romData)).to.be.an('object'); // Uint8Array
    expect(createCartridge(romData.buffer)).to.be.an('object'); // ArrayBuffer
    expect(createCartridge([...romData])).to.be.an('object'); // Array
  });

  it('throws error for invalid data type', () => {
    expect(() => createCartridge()).to.throw(Error);
    expect(() => createCartridge(null)).to.throw(Error);
    expect(() => createCartridge(1)).to.throw(Error);
    expect(() => createCartridge(true)).to.throw(Error);
    expect(() => createCartridge('x')).to.throw(Error);
    expect(() => createCartridge({})).to.throw(Error);
  });

  it('creates cartridge from valid data format', () => {
    const cartridge = createCartridge(romData);
    expect(cartridge).to.be.an('object');
    expect(cartridge.mapper).to.be.equal('NROM');
    expect(cartridge.submapper).to.be.undefined;
    expect(cartridge.region).to.be.equal(Region.NTSC);
    expect(cartridge.mirroring).to.be.equal(Mirroring.HORIZONTAL);
    expect(cartridge.prgROMSize).to.be.equal(0x4000);
    expect(cartridge.chrROMSize).to.be.equal(0x2000);
    expect(cartridge.prgRAMSize).to.be.equal(0x2000);
    expect(cartridge.chrRAMSize).to.be.equal(0);
    expect(cartridge.prgRAMSizeBattery).to.be.equal(0);
    expect(cartridge.chrRAMSizeBattery).to.be.equal(0);
    expect(cartridge.prgROM.length).to.be.equal(0x4000);
    expect(cartridge.chrROM.length).to.be.equal(0x2000);
  });

  it('throws error for invalid data format', () => {
    expect(() => createCartridge(new Uint8Array(100))).to.throw(Error);
  });

  it('computes SHA-1', () => {
    const cartridge = createCartridge(romData);
    expect(cartridge.sha1).to.be.equal('4131307f0f69f2a5c54b7d438328c5b2a5ed0820');
  });

  it('fails to unzip ROM image when JSZip is not provided', () => {
    expect(() => createCartridge(zipData)).to.throw(Error);
  });

  it('unzips ROM image when JSZip is provided', () => {
    const cartridge1 = createCartridge(zipData, JSZip);
    const cartridge2 = createCartridge(romData);
    expect(cartridge1).to.deep.equal(cartridge2);
  });

  it('reads cartridge from file', () => {
    const cartridge1 = readCartridge('./test/roms/nestest/nestest.nes');
    const cartridge2 = createCartridge(romData);
    expect(cartridge1).to.deep.equal(cartridge2);
  });

  it('reads cartridge from zipped file', () => {
    const cartridge1 = readCartridge('./test/roms/nestest/nestest.zip', JSZip);
    const cartridge2 = createCartridge(zipData, JSZip);
    expect(cartridge1).to.deep.equal(cartridge2);
  });
});
