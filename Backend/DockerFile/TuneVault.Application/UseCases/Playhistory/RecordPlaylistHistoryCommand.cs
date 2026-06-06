using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Playhistory;

public record RecordPlayHistoryCommand(
    string userID,
    int MediaItemID
) : IRequest;
